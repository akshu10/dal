import type { Referral, ReferralStatus } from '@/model';
import axios, { Axios } from 'axios';

export interface UpdateReferral
  extends Omit<
    Partial<Referral>,
    'id' | 'openedAt' | 'createdAt' | 'closedAt' | 'updatedAt' | 'age' | 'ageAtReferral'
  > {}

export interface CreateReferral
  extends Omit<
    Referral,
    | 'id'
    | 'referralDate'
    | 'openedAt'
    | 'createdAt'
    | 'closedAt'
    | 'updatedAt'
    | 'status'
    | 'age'
    | 'ageAtReferral'
    | 'readonly'
    | 'archivedAt'
    | 'deletedAt'
  > {
  middleName?: string;
}

export interface FindReferrals {
  status?: ReferralStatus | Array<ReferralStatus>;
  search?: string;
}

const baseURL = 'http://localhost:8000';

const client = axios.create({
  baseURL
});

const getReferral = async (id: string): Promise<Referral | null> => {
  try {
    const result = await client.get(`/referrals/${id}`);

    return result.data;
  } catch (error) {
    console.error(error.message);

    return null;
  }
};

const findReferrals = async (args: FindReferrals): Promise<{ referrals: Referral[]; count: number }> => {
  const result = await client.get('/referrals', {
    params: {
      status: args.status,
      search: args.search
    }
  });

  return result.data;
};

const createReferral = async (referral: CreateReferral): Promise<Referral> => {
  const result = await client.post('/referrals', referral);

  return result.data as Referral;
};

const updateReferral = async (id: string, referral: UpdateReferral): Promise<string> => {
  const result = await client.patch(`/referrals/${id}`, referral);

  return result.data as string;
};

export { findReferrals, createReferral, updateReferral, getReferral };
