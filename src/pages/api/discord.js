export function handler() {
  return new Response(null, {
    status: 301,
    headers: {
      Location: "https://discord.gg/dmDmjFCKuH",
    },
  });
}
