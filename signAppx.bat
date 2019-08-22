@echo off
echo Sign AppX is used for local testing of appx packages. You don't need to sign packages to submit to the Microsoft Store.
@echo on
signtool sign /fd sha256 dist/*.appx