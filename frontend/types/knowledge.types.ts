export type KnowledgeDocStatus = 'PROCESSING' | 'INDEXED' | 'FAILED';

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'PDF' | 'DOCX' | 'TXT';
  status: KnowledgeDocStatus;
  chunkCount: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}
