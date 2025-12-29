import { Router } from 'express';

import {
  submitInviteRequest,
  adminApproveInvite,
  verifyInviteCode,
  createInvitedUser,
  listInviteRequests,
} from '../controllers/inviteRequest.controller';
import { validateInvite, redeemInvite } from '../controllers/invite.controller';
import { requireAdminAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/request', submitInviteRequest);
router.post('/approve', requireAdminAuth, adminApproveInvite);
router.get('/requests', requireAdminAuth, listInviteRequests);
router.post('/verify', verifyInviteCode);
router.post('/create-user', createInvitedUser);
router.post('/validate', validateInvite);
router.post('/redeem', redeemInvite);

export default router;
