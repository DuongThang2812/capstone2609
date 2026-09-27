import { Router, type RequestHandler } from 'express';
import type { Multer } from 'multer';
import type { ImageController } from '../controllers/image.controller.js';

export function imageRoutes(controller: ImageController, auth: RequestHandler, upload: Multer) {
  const router = Router();
  router.get('/', controller.list);
  router.get('/search', controller.search);
  router.post('/upload', auth, upload.single('image'), controller.upload);
  router.get('/:id/comments', controller.comments);
  router.post('/:id/comments', auth, controller.comment);
  router.get('/:id/is-saved', auth, controller.isSaved);
  router.get('/:id', controller.detail);
  router.delete('/:id', auth, controller.delete);
  return router;
}
