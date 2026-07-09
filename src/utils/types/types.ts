/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
export interface UserDataTypes {
  name: string;
  date: string;
  amount: string;
  imageUrl: string;
}

export interface ReviewFeedbackCardTypes {
  name: string;
  rating: number;
  feedback: string;
  avatar: string;
  amount: string;
  date: string;
  Comment: string;
  replyPersonProfileURL: string;
}

export interface GetTipsApiResponse {
  data: any;
  items: TipItemType[];
  meta: MetaDataType;
  message: string;
}

export interface GetBalanceAmount {
  balance: number;
  totalEarned: number;
}

export interface CardDetails {
  cardHolderName: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
  cardNickname: string;
}

export interface GetTipperTipsApiResponse {
  items: any;
  meta: MetaDataType;
  message: string;
}

export interface AddWithdrawalType {
  UserId: string;
  PaymentMethod: string;
  TotalAmount: number;
  Status: boolean;
}

export interface TipItemType {
  avatar: string;
  name: string;
  TipId: number;
  TipperID: string;
  ServiceProviderID: string;
  Amount: string;
  AmountInAED: string;
  NetAmount?: string;
  NetAmountInAED?: string;
  Currency?: string;
  amount: string;
  TipDate: string;
  date: string;
  Review: string;
  Rating: number;
  rating: number;
  Comment: string;
  feedback: string;
  ReviewDate: string;
  createdAt: string;
  updatedAt: string;
  replyPersonProfileURL: string;
  Avatar: string;
  PaymentMethodType?: 'STRIPE' | 'BALANCE';
  tipper: UserType;
  serviceProvider: UserType;
}

export interface TipCommentsType {
  TipId: number;
  Comment: string;
  date?: string;
}

export interface RatingDistribution {
  rating: number;
  percentage: string;
}

export interface RatingsSummaryResponse {
  overallRating: string;
  totalRatings: number;
  ratingsDistribution: RatingDistribution[];
  message: string;
}

export interface UserDetails {
  id?: number;
  KeyCloakID?: string;
  Username?: string;
  FirstName?: string;
  LastName?: string;
  Address?: string;
  Email?: string;
  Phone?: string;
  Whatsapp?: string;
  Country?: string;
  City?: string;
  VerificationCode?: string | null;
  Bio?: string | null;
  ProfilePictureURL?: string | null;
  DateOfBirth?: Date | any | null;
  Role?: string;
  Status?: string;
  NotificationSettings?: Record<string, any> | null;
  BankDetails?: any;
  IBANNumber?: string | null;
  AccNumber?: string | null;
  Paypal?: string | null;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  fcmToken?: string | null;
  tipsGiven?: TipItemType[];
  tipsReceived?: TipItemType[];
  bankDetails?: any;
  balance?: number;
  BalanceOriginal?: number;
  TotalTips?: number;
  TotalTipsOriginal?: number;
  TotalTipsGiven?: number;
  TotalTipsGivenOriginal?: number;
  TotalWithdrawal?: number;
  TotalWithdrawalOriginal?: number;
  ConnectedBankAccountId?: string;
  isOnboarded?: boolean;
}

export interface UserRole {
  Role: string;
}

export interface UserType {
  id: number;
  KeyCloakID: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Address: string;
  Country: string;
  City: string;
  VerificationCode: string | null;
  Bio: string;
  ProfilePictureURL: string;
  DateOfBirth: string | null;
  Role: string;
  NotificationSettings: string | null;
  BankDetails: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface MetaDataType {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface NotificationType {
  NotificationID: string;
  Title: string;
  Message: string;
  NotificationDate: string;
  IsRead: boolean;
  RichText?: string;
  TipperProfilePictureUrl?: string;
  tipper?: UserType;
}

export interface NotificationsResponse {
  items: NotificationType[];
  meta: MetaDataType;
  message: string;
}

export interface WithdrawHistoryItem {
  InvoiceID: number | string;
  TotalAmount: number;
  PaymentMethod?: string;
  Currency?: string;
  Status?: string;
  createdAt?: string;
  CreatedAt?: string;
}

export interface PaginatedWithdrawHistoryResponse {
  items: WithdrawHistoryItem[];
  meta: MetaDataType;
}

export interface BalanceTransferItem {
  TipId: number;
  tipperName?: string;
  serviceProviderName?: string;
  paymentMethodType?: string;
  transferType?: string;
  gross?: number;
  platformFee?: number;
  netTransferred?: number;
  amounts?: {
    gross?: { amount?: number; currency?: string };
    platformFee?: { amount?: number; currency?: string };
    netTransferred?: { amount?: number; currency?: string };
  };
  createdAt?: string;
}

export interface PaginatedBalanceTransferResponse {
  items: BalanceTransferItem[];
  meta: MetaDataType;
}

export interface WithdrawHistoryResponse {
  [x: string]: any;
  InvoiceID: string;
  TotalAmount: number;
  CreatedAt: Date;
  type: string;
}

export interface WithdrawalInvoice {
  UserID: string;
  PaymentMethod: string;
  TotalAmount: number;
  WithdrawAmountInAED: number;
  Currency: string;
  StripeTransferId?: string;
  Status: string;
  StripePayoutId?: string;
  StripeFee?: number | string;
  PlatformFee?: number | string;
  PlatformFeeAED?: number;
  Commission?: string;
  amounts?: {
    platformFee?: { amount?: number; amounts?: Record<string, number> };
    stripeFee?: { amount?: number; amounts?: Record<string, number> };
  };
  InvoiceID: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWithdrawalResponse {
  invoice: WithdrawalInvoice;
  balance: number;
  withdrawAmountInAED: number;
}

export interface WithdrawalSuccessState {
  flow: "withdrawal";
  invoice: WithdrawalInvoice;
  balance: number;
  withdrawAmountInAED: number;
  message: string;
}

export interface CurrencyRates {
  [key: string]: number;
}
export interface RatingsSummaryIDResponse {
  overallRating: string;
  totalRatings: number;
  ratingsDistribution: RatingDistribution[];
  message: string;
  ServiceProviderName: string;
  ProfilePicture: string;
}
