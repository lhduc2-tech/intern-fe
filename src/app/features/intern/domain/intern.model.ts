export interface InternResponse {
  id: string;
  userId: string;
  status: string;
  projectId: string;
  internshipSessionId: string;
  graduated: boolean;
  companyAccount: string;
  technology: string;
  mentorId: string;
  organization: string;
  gender: string;
  dateOfBirth: string;
  identityNumber: string;
  identityIssueDate: string;
  level: string;
  major: string;
  university: string;
  phone: string;
  permanentAddress: string;
  position: string;
  internshipStartDate: string;
  internshipEndDate: string;
  acceptanceDocument: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface InternSearchRequest {
  userId?: string;
  status?: string;
  projectId?: string;
  internshipSessionId?: string;
  graduated?: boolean;
  companyAccount?: string;
  mentorId?: string;
  organization?: string;
  pageIndex?: number;
  pageSize?: number;
  sort?: string;
  direction?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
