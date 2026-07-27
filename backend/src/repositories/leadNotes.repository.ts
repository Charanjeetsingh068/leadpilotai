import { LeadNotesModel, ILeadNotesDocument } from '../models/LeadNotes.model';

export class LeadNotesRepository {
  async addNote(leadId: string, authorId: string, noteText: string): Promise<ILeadNotesDocument> {
    return LeadNotesModel.create({
      leadId,
      authorId,
      noteText,
    });
  }

  async findByLeadId(leadId: string): Promise<ILeadNotesDocument[]> {
    return LeadNotesModel.find({ leadId }).populate('authorId', 'name email').sort({ createdAt: -1 });
  }
}
