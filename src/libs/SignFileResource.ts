export type SignFileResource =
  | 'profileImage'
  | 'chatMessage'
  | 'scheduleReceipt';

export const SignFileResources: Record<SignFileResource, SignFileResource> = {
  profileImage: 'profileImage',
  chatMessage: 'chatMessage',
  scheduleReceipt: 'scheduleReceipt',
};
