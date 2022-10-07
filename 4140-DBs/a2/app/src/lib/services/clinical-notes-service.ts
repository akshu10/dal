import type { ClinicalNotes } from '@/model';
import axios from '../axios';

export interface UpdateClinicalNotes extends Omit<Partial<ClinicalNotes>, 'id' | 'createdAt' | 'updatedAt'> {}

export interface CreateClinicalNotes extends Omit<ClinicalNotes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface FindClinicalNotes {
  referralId?: string;
}

const getClinicalNotes = async (id: string): Promise<ClinicalNotes | null> => {
  try {
    const result = await axios.get(`/clinical-notes/${id}`);

    return result.data;
  } catch (error) {
    console.error(error.message);

    return null;
  }
};

const findClinicalNotes = async (
  args?: FindClinicalNotes
): Promise<{ clinicalNotes: ClinicalNotes[]; count: number }> => {
  const result = await axios.get('/clinical-notes', {
    params: {
      referralId: args?.referralId || undefined
    }
  });

  return result.data;
};

const createClinicalNotes = async (clinicalNotes: CreateClinicalNotes): Promise<ClinicalNotes> => {
  const result = await axios.post('/clinical-notes', clinicalNotes);

  return result.data as ClinicalNotes;
};

const updateClinicalNotes = async (id: string, clinicalNotes: UpdateClinicalNotes): Promise<string> => {
  const result = await axios.patch(`/clinical-notes/${id}`, clinicalNotes);

  return result.data as string;
};

export { findClinicalNotes, createClinicalNotes, updateClinicalNotes, getClinicalNotes };
