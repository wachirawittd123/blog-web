import path from "path"
import formidable from "formidable"
import fs from "fs"
import { NextApiRequest } from "next"

const formatDateForFilename = (): string => {
  const now = new Date()
  const pad = (n: number) => (n < 10 ? `0${n}` : n)
  const d = pad(now.getDate())
  const m = pad(now.getMonth() + 1)
  const y = now.getFullYear()
  const h = pad(now.getHours())
  const min = pad(now.getMinutes())
  const s = pad(now.getSeconds())
  return `${d}${m}${y}-${h}:${min}:${s}`
}

export const generateRandomString = (length: number = 10): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const generateUploadFilename = (originalFilename: string): string => {
  const timestamp = formatDateForFilename()
  const random = generateRandomString(10)
  const ext = path.extname(originalFilename || "")
  return `${random}-${timestamp}${ext}`
}


export const uploadDir = (folder: string): string => {
    return path.join(process.cwd(), "public", "uploads", folder)
}

export const parseForm = async (
    req: NextApiRequest,
    folder?: string
  ): Promise<{ fields: Record<string, string>; files: any }> => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: uploadDir(folder || "common"),
      filename: (name, ext, part) => {
        return generateUploadFilename(part.originalFilename || "file")
      },
    })
  
    await fs.promises.mkdir(uploadDir(folder || "common"), { recursive: true })
  
    return new Promise((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err)
  
        // 🛠️ FIX: convert all fields to string instead of array
        const normalizedFields: Record<string, string> = {}
        Object.keys(fields).forEach((key) => {
            const value = fields[key]
            const str = Array.isArray(value) ? value[0] : value
            if (typeof str === 'string') {
              normalizedFields[key] = str
            }
        })
  
        resolve({ fields: normalizedFields, files })
      })
    })
}

export const removeFile =async(oldFile: string, newFile: string, folder: string) => {
    let currentFile = oldFile
    if (newFile) {
        const newFilename = `${folder}/${path.basename(newFile as string)}`
        if (oldFile && oldFile !== newFilename) {
          const fullOldPath = path.join(process.cwd(), "public", oldFile)
          if (fs.existsSync(fullOldPath)) {
            await removeDefaultFile(fullOldPath)
          }
        }
        currentFile = newFilename
    }
    return currentFile
}

export const removeDefaultFile = async(file: string) => {
    return await fs.promises.unlink(file) 
}