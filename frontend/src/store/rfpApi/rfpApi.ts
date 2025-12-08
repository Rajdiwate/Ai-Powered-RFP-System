import { rtkBaseQuery } from '@/utils/rtk';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Rfp {
  id: string;
  title: string;
  requirements: string;
  categoryId: string;
  maxBudget: number;
  quantity: number;
  timeToDeliver: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface VendorNotifyParams {
  vendorId: string;
  rfpId: string;
}

export interface ProposalEvaluation {
  vendor: string;
  score: number;
  details: {
    pricing: number; // score
    terms: number; // score
    completeness: number; // score
  };
  recommendation: string;
}

export interface EvaluationResponse {
  evaluations: ProposalEvaluation[];
  summary: string;
}

export const RFP_TAG = 'rfp';
export const VENDOR_TAG = 'vendor';
export const PROPOSAL_TAG = 'proposal';

import { Endpoints } from '@/constants/endpoints';

export const rfpApi = createApi({
  reducerPath: 'rfp',
  baseQuery: rtkBaseQuery(),
  tagTypes: [RFP_TAG, VENDOR_TAG, PROPOSAL_TAG],
  endpoints: (builder) => ({
    createRfp: builder.mutation<Rfp, { text: string }>({
      query: (data) => ({ url: Endpoints.rfp.create, method: 'post', data }),
      invalidatesTags: [RFP_TAG],
    }),
    getRfps: builder.query<Rfp[], void>({
      query: () => ({ url: Endpoints.rfp.getAll, method: 'get' }),
      providesTags: [RFP_TAG],
    }),
    getAllVendors: builder.query<Vendor[], void>({
      query: () => ({ url: Endpoints.vendor.getAll, method: 'get' }),
      providesTags: [VENDOR_TAG],
    }),
    notifyVendor: builder.mutation<void, VendorNotifyParams>({
      query: (data) => ({ url: Endpoints.vendor.notify, method: 'post', data }),
    }),
    evaluateProposals: builder.query<EvaluationResponse, string>({
      query: (rfpId) => ({ url: Endpoints.proposal.evaluate(rfpId), method: 'get' }),
      providesTags: [PROPOSAL_TAG],
    }),
  }),
});

export const {
  useCreateRfpMutation,
  useGetAllVendorsQuery,
  useNotifyVendorMutation,
  useEvaluateProposalsQuery,
  useGetRfpsQuery,
} = rfpApi;
