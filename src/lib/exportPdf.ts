import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface ExportOptions {
  reportType?: string
  onStart?: () => void
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onError?: (error: any) => void
}

export async function exportExecutiveReportToPdf(
  container: HTMLDivElement | null,
  options: ExportOptions = {}
): Promise<void> {
  const {
    reportType = "Sustainability_Report",
    onStart,
    onProgress,
    onComplete,
    onError,
  } = options

  if (!container) {
    const err = new Error("Template container ref is not mounted.")
    if (onError) onError(err)
    return Promise.reject(err)
  }

  try {
    if (onStart) onStart()

    // Find all pages by ID prefix
    const pages = Array.from(container.querySelectorAll('[id^="pdf-page-"]')) as HTMLDivElement[]
    
    if (pages.length === 0) {
      throw new Error("No PDF pages found in the template container.")
    }

    // Initialize jsPDF with A4 size in portrait orientation
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth() // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm

    for (let i = 0; i < pages.length; i++) {
      if (onProgress) {
        // Report progress (e.g. 0 to 100)
        onProgress(Math.round(((i) / pages.length) * 100))
      }

      const pageElement = pages[i]

      // Capture the A4 page div at 2x scale for sharp text and graphics
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#09090b", // Matches dark style
        windowWidth: 794,
        windowHeight: 1123,
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.95)

      // Add to PDF
      if (i > 0) {
        pdf.addPage()
      }
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight)
    }

    if (onProgress) {
      onProgress(100)
    }

    // Save the PDF file
    const formattedDate = new Date().toISOString().split("T")[0]
    const filename = `CarbonSphere_AI_${reportType.replace(/\s+/g, "_")}_${formattedDate}.pdf`
    pdf.save(filename)

    if (onComplete) onComplete()
  } catch (error) {
    if (onError) onError(error)
    throw error
  }
}
