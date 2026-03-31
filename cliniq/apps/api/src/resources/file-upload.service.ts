import { Injectable, Logger } from '@nestjs/common';
import { ResourceType, RESOURCE_TYPE_DEFINITIONS, validateFileType, getFileType } from '@cliniq/shared-types';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadDir = 'uploads';

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  async uploadFile(file: Express.Multer.File): Promise<{ fileRef: string; fileType: string }> {
    try {
      // Determine file type
      const fileType = getFileType(file.originalname);
      const typeDefinition = RESOURCE_TYPE_DEFINITIONS[fileType];

      // Validate file type
      if (!validateFileType(file.originalname, typeDefinition.allowedFormats)) {
        throw new Error(`Invalid file type. Allowed formats: ${typeDefinition.allowedFormats.join(', ')}`);
      }

      // Validate file size
      if (file.size > typeDefinition.maxSize) {
        throw new Error(`File too large. Maximum size: ${this.formatFileSize(typeDefinition.maxSize)}`);
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Save file
      await this.saveFile(file.buffer, filePath);

      this.logger.log(`File uploaded: ${fileName} (${fileType})`);

      return {
        fileRef: fileName,
        fileType,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileRef: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, fileRef);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`File deleted: ${fileRef}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file ${fileRef}: ${error.message}`);
      throw error;
    }
  }

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  private async saveFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileStats(fileRef: string): { exists: boolean; size?: number; type?: string } | null {
    try {
      const filePath = path.join(this.uploadDir, fileRef);
      
      if (!fs.existsSync(filePath)) {
        return { exists: false };
      }

      const stats = fs.statSync(filePath);
      const fileType = getFileType(fileRef);

      return {
        exists: true,
        size: stats.size,
        type: fileType,
      };
    } catch (error) {
      this.logger.error(`Failed to get file stats for ${fileRef}: ${error.message}`);
      return null;
    }
  }

  validateFile(file: Express.Multer.File, allowedTypes: ResourceType[]): { isValid: boolean; error?: string } {
    try {
      const fileType = getFileType(file.originalname);
      
      if (!allowedTypes.includes(fileType)) {
        return {
          isValid: false,
          error: `File type ${fileType} not allowed. Allowed types: ${allowedTypes.join(', ')}`
        };
      }

      const typeDefinition = RESOURCE_TYPE_DEFINITIONS[fileType];

      if (!validateFileType(file.originalname, typeDefinition.allowedFormats)) {
        return {
          isValid: false,
          error: `Invalid file format. Allowed formats: ${typeDefinition.allowedFormats.join(', ')}`
        };
      }

      if (file.size > typeDefinition.maxSize) {
        return {
          isValid: false,
          error: `File too large. Maximum size: ${this.formatFileSize(typeDefinition.maxSize)}`
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: `File validation failed: ${error.message}`
      };
    }
  }
}
