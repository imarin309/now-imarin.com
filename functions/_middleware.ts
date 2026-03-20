export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  const url = new URL(context.request.url);
  const segments = url.hostname.split(".");

  // プレビューURL (hash.now-imarin-com.pages.dev = 4セグメント) は除外
  // 本番pages.devURL (now-imarin-com.pages.dev = 3セグメント) のみリダイレクト
  if (segments.length === 3 && url.hostname.endsWith("pages.dev")) {
    const redirectUrl = new URL(
      url.pathname + url.search,
      "https://now-imarin.com",
    );
    return Response.redirect(redirectUrl.toString(), 308);
  }

  return context.next();
}
