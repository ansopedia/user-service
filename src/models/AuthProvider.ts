import mongoose, { Document, Schema } from 'mongoose';

// OAuth Provider Schema
export interface IOAuthProvider extends Document {
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiryDate?: Date;
}

export const oAuthProviderSchema: Schema<IOAuthProvider> = new Schema({
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  tokenExpiryDate: {
    type: Date,
  },
});

export const OAuthProviderModel = mongoose.model<IOAuthProvider>('oauth_providers', oAuthProviderSchema);
