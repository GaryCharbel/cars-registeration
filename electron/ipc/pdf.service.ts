import { ipcMain } from 'electron'
import fs from 'fs/promises'
import path from 'path'

// Handle PDF reading
ipcMain.handle('read-pdf', async (_event, filePath: string) => {
    try {
        const data = await fs.readFile(filePath)
        return { success: true, data: data.toString('base64') }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
})

// Handle PDF saving
ipcMain.handle('save-pdf', async (_event, { fileName, data }: { fileName: string; data: string }) => {
    try {
        const outputDir = path.join(process.cwd(), 'output', 'filled-pdfs')
        await fs.mkdir(outputDir, { recursive: true })

        const outputPath = path.join(outputDir, fileName)
        const buffer = Buffer.from(data, 'base64')
        await fs.writeFile(outputPath, buffer)

        return { success: true, path: outputPath }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
})
