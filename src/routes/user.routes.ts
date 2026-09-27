import { Router, type RequestHandler } from 'express';
import type { Multer } from 'multer';
import type { UserController } from '../controllers/user.controller.js';

export function userRoutes(controller: UserController, auth: RequestHandler, upload: Multer) {
  const router = Router();
  router.use(auth);
  router.get('/profile', controller.profile);
  router.put('/profile', upload.single('avatar'), controller.update);
  router.get('/saved-images', controller.saved);
  router.get('/created-images', controller.created);
  return router;
}
