const express = require('express');
const {
  create, getAll, getById, update, remove, uploadPhoto, exportPDF,
} = require('../controllers/biodataController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/:id/photo', upload.single('photo'), uploadPhoto);
router.get('/:id/pdf', exportPDF);

module.exports = router;
