
REVOKE ALL ON FUNCTION public.sync_shopify_estoque() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._http_wait(BIGINT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_shopify_estoque() TO service_role;
GRANT EXECUTE ON FUNCTION public._http_wait(BIGINT, INTEGER) TO service_role;
