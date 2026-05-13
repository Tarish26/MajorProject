$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open('C:\Programming\major\dashboard\IG02_PPT.pptx')
$app.Visible = 1
$slide = $pres.Slides.Item(9)

foreach ($shape in $slide.Shapes) {
    if ($shape.HasTextFrame -eq -1) {
        if ($shape.TextFrame.TextRange.Text.Contains('Real-Time Card Editor')) {
            $shape.TextFrame.TextRange.Text = "Advanced Feature Implementation`r`n" +
            "• Dynamic Data Upload & Parsing: Implemented a robust CsvParserService using PapaParse to ingest user-provided CSV files directly from the UI.`r`n" +
            "• Expanded Feature Modules: Developed dedicated UI modules for Analytics, Users, Products, and Orders.`r`n" +
            "• State Persistence & Flicker-Free Updates: Enhanced the DashboardService caching mechanism.`r`n" +
            "• Comprehensive Responsiveness: Refactored the overall layout (Sidebar, Header, Layout Engine) to be fully responsive for mobile and desktop."
        }
    }
}
$pres.Save()
$app.Quit()
