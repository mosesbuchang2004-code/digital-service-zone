REVOKE EXECUTE ON FUNCTION public.bootstrap_account(text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fund_wallet(numeric) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.purchase_service(text, text, numeric, jsonb) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_account(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fund_wallet(numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_service(text, text, numeric, jsonb) TO authenticated;