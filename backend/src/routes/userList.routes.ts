import { Router } from 'express';

import {
    createUserList, getAllUserLists, getUserLists, addMovieToList, removeMovieFromList, deleteUserList, updateUserList, getUserListById, getCurrentUserLists
} from '../controller/userList.controller';
import requireUser from '../middleware/requireUser';

const router = Router();

router.post('/api/user-lists', requireUser, createUserList);
router.get('/api/user-lists', getAllUserLists);
router.get('/api/user-lists/:userId', getUserLists);
router.post('/api/user-lists/:listId/movies', requireUser, addMovieToList);
router.delete('/api/user-lists/:listId/movies', requireUser, removeMovieFromList);
router.delete('/api/user-lists/:listId', requireUser, deleteUserList);
router.put('/api/user-lists/:listId', requireUser, updateUserList);
router.get('/api/user-lists/current/me', requireUser, getCurrentUserLists);
router.get('/api/user-lists/list/:listId', getUserListById);

export default router;
