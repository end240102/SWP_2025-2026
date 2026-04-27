import { Context, Hono } from "hono";
import { serveStatic } from "hono/deno";
import { Database } from "sqlite";

const app = new Hono();
const db = new Database("lieblingsessen.db");
const isDev = true;

db.exec(`
    CREATE TABLE IF NOT EXISTS dummy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        essen TEXT,
        zeitstempel INTEGER DEFAULT (strftime('%s', 'now'))
    )
`);

db.exec(`
    INSERT INTO dummy (name, essen) VALUES 
    ('Max', 'Pizza'),
    ('Anna', 'Sushi'),
    ('Tom', 'Burger')
`);

app.get("/:path{.+\\.ts$}", async (c) => {
     const filePath = `./src/${c.req.param("path")}`;
    // prepend "src/"
    console.log(`Transpiling ${filePath}`);

    try {
        const result = await Deno.bundle({
            entrypoints: [filePath],
            platform: "browser",
            minify: !isDev,
            write: false, // Don't write to disk, keep in memory
            format: "esm",
        });
        if (!result.success) throw new Error("Bundling failed");

        // Extract the bundled JS content from the in-memory result.
        const jsFile = result.outputFiles?.find((f) => typeof f.text === "function");
        const js = jsFile?.text();

        if (!js) throw new Error("Bundling did not produce JavaScript output");

        return c.body(js, 200, {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": isDev ? "no-cache" : "public, max-age=31536000",
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.text(`Transpilation Error: ${message}`, 500);
    }
});

app.use("/*", serveStatic({ root: "./static" }));

app.get("/essen", (c: Context) => {
    const rows = db.prepare(`
    SELECT id, name, essen, zeitstempel
    FROM dummy;
  `).all();

    return c.json(rows);
});

app.delete("/essen/:id", (c: Context) => {
    const id = c.req.param("id");
    db.prepare("DELETE FROM dummy WHERE id = ?").run(id);
    return c.json({ success: true });
});

Deno.serve(app.fetch);
