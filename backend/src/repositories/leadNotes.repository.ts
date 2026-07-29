import { prisma } from '../config/database';

export class LeadNotesRepository {
  async addNote(leadId: string, authorId: string, noteText: string): Promise<any> {
    const note = await prisma.leadNote.create({
      data: {
        leadId,
        authorId,
        content: noteText,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      id: note.id,
      leadId: note.leadId,
      authorId: note.author ? { name: note.author.name, email: note.author.email } : null,
      noteText: note.content,
      createdAt: note.createdAt,
    };
  }

  async findByLeadId(leadId: string): Promise<any[]> {
    if (!leadId || leadId.length !== 36) return [];
    
    const notes = await prisma.leadNote.findMany({
      where: { leadId },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return notes.map((note) => ({
      id: note.id,
      leadId: note.leadId,
      authorId: note.author ? { name: note.author.name, email: note.author.email } : null,
      noteText: note.content,
      createdAt: note.createdAt,
    }));
  }
}
