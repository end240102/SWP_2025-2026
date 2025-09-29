import { assertEquals } from "@std/assert";
import { add } from "./main.ts";
import { multiply } from "./main.ts";
import { divide } from "./main.ts";
import { sub } from "./main.ts";
import { squareroot } from "./main.ts";


Deno.test("addTest", () => {
  assertEquals(add(2, 3), 5);
});

Deno.test("multiplyTest", () => {
  assertEquals(multiply(2, 5), 10);
});

Deno.test("divideTest", () => {
  assertEquals(divide(10, 2), 5);
});

Deno.test("subTest", () => {
  assertEquals(sub(10, 2), 8);
});

Deno.test("squarerootTest", () => {
  assertEquals(squareroot(49), 7);
});