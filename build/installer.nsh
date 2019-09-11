
!macro preInit
 # MessageBox MB_OK 'hello'
  ExecWait 'taskkill.exe /f /im ModernDeck.exe /fi "MEMUSAGE gt 16000"'
!macroend
