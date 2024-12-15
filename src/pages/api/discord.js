export function handler() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "https://discord.gg/dmDmjFCKuH",
    },
  });
}
