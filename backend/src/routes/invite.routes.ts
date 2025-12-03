import { Router } from 'express';

import {
  submitInviteRequest,
  adminApproveInvite,
  verifyInviteCode,
  createInvitedUser,
} from '../controllers/inviteRequest.controller';

const router = Router();

router.post('/request', submitInviteRequest);
router.post('/approve', adminApproveInvite);
router.post('/verify', verifyInviteCode);
router.post('/create-user', createInvitedUser);

export default router;
