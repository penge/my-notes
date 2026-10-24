import call from "../call";

const respond = (ok: boolean, body: string) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    text: () => Promise.resolve(body),
    json: () => Promise.resolve({ body }),
  });
};

test("call() returns the response when the request succeeds", async () => {
  respond(true, "content");

  const response = await call("https://example.com", {});

  expect(await response.text()).toBe("content");
});

test("call() treats an error status like a failed request, so its body is never used", async () => {
  respond(false, "<html>Service Unavailable</html>");

  const response = await call("https://example.com", {});

  expect(await response.text()).toBeUndefined();
  expect(await response.json()).toBeUndefined();
});

test("call() treats a network error as a failed request", async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"));

  const response = await call("https://example.com", {});

  expect(await response.text()).toBeUndefined();
});

test("call() reads a body that fails to arrive as undefined", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.reject(new TypeError("network error")),
    json: () => Promise.reject(new TypeError("network error")),
  });

  const response = await call("https://example.com", {});

  expect(await response.text()).toBeUndefined();
  expect(await response.json()).toBeUndefined();
});
