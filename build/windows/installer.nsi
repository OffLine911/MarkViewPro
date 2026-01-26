; MarkViewPro NSIS Installer Script - File Associations
; This script adds file associations for .md and .markdown files

!include "FileAssociation.nsh"

; File Association Macros
!macro RegisterFileAssociation EXT DESCRIPTION ICON_INDEX
  WriteRegStr HKCR ".${EXT}" "" "MarkViewPro.${EXT}"
  WriteRegStr HKCR "MarkViewPro.${EXT}" "" "${DESCRIPTION}"
  WriteRegStr HKCR "MarkViewPro.${EXT}\DefaultIcon" "" "$INSTDIR\MarkViewPro.exe,${ICON_INDEX}"
  WriteRegStr HKCR "MarkViewPro.${EXT}\shell\open\command" "" '"$INSTDIR\MarkViewPro.exe" "%1"'
!macroend

!macro UnregisterFileAssociation EXT
  DeleteRegKey HKCR ".${EXT}"
  DeleteRegKey HKCR "MarkViewPro.${EXT}"
!macroend

Section "FileAssociations"
  ; Register .md files
  !insertmacro RegisterFileAssociation "md" "Markdown Document" "0"
  
  ; Register .markdown files
  !insertmacro RegisterFileAssociation "markdown" "Markdown Document" "0"
  
  ; Refresh shell icons
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
SectionEnd

Section "un.FileAssociations"
  ; Unregister file associations
  !insertmacro UnregisterFileAssociation "md"
  !insertmacro UnregisterFileAssociation "markdown"
  
  ; Refresh shell icons
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
SectionEnd
