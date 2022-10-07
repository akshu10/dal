export type ReferralStatus = 'new' | 'opened' | 'closed' | 'archived' | 'deleted';
export type ReferralType = 'self' | 'professional';

export interface ClinicalNotes {
  id: string;
  referralId: string;
  notes: string;
  // TODO
  //createdBy: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  age: number;
  ageAtReferral: number;
  referralDate: Date;
  referralType: ReferralType;
  guardiansName: string;
  primaryPhone: string;
  secondaryPhone: string;
  issuesConcerns: string;
  requestedService: string;
  mailingAddress: string;
  openedAt: Date | null;
  closedAt: Date | null;
  archivedAt: Date | null;
  deletedAt: Date | null;
  status: ReferralStatus;
  methodOfPayment?: string;
  contactReferrer?: boolean;
  createdAt: Date;
  updatedAt: Date;
  readonly: boolean;
  search?: string | null;
}
