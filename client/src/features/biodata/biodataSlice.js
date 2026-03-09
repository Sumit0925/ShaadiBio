import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { biodataService } from '../../services/biodataService';
import { BLANK_FORM } from '../../utils/constants';

export const fetchAllBiodata = createAsyncThunk('biodata/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await biodataService.getAll();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load biodata');
  }
});

export const fetchBiodataById = createAsyncThunk('biodata/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await biodataService.getById(id);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load biodata');
  }
});

export const saveBiodata = createAsyncThunk('biodata/save', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const data = id
      ? await biodataService.update(id, formData)
      : await biodataService.create(formData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save biodata');
  }
});

export const deleteBiodata = createAsyncThunk('biodata/delete', async (id, { rejectWithValue }) => {
  try {
    await biodataService.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete');
  }
});

export const uploadPhoto = createAsyncThunk('biodata/uploadPhoto', async ({ id, file }, { rejectWithValue }) => {
  try {
    const data = await biodataService.uploadPhoto(id, file);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Photo upload failed');
  }
});

const biodataSlice = createSlice({
  name: 'biodata',
  initialState: {
    formData: { ...BLANK_FORM },
    savedList: [],
    currentId: null,
    loading: false,
    saveStatus: 'idle', // idle | saving | saved | error
    error: null,
  },
  reducers: {
    setField(state, action) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    setFormData(state, action) {
      state.formData = { ...BLANK_FORM, ...action.payload };
    },
    setTemplate(state, action) {
      state.formData.template = action.payload;
    },
    resetForm(state) {
      state.formData = { ...BLANK_FORM };
      state.currentId = null;
      state.saveStatus = 'idle';
      state.error = null;
    },
    clearSaveStatus(state) {
      state.saveStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchAllBiodata.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBiodata.fulfilled, (state, action) => {
        state.loading = false;
        state.savedList = action.payload.biodatas || action.payload || [];
      })
      .addCase(fetchAllBiodata.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // fetch one
      .addCase(fetchBiodataById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBiodataById.fulfilled, (state, action) => {
        state.loading = false;
        const bd = action.payload.biodata || action.payload;
        state.formData = { ...BLANK_FORM, ...bd };
        state.currentId = bd._id || bd.id;
      })
      .addCase(fetchBiodataById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // save
      .addCase(saveBiodata.pending, (state) => { state.saveStatus = 'saving'; state.error = null; })
      .addCase(saveBiodata.fulfilled, (state, action) => {
        state.saveStatus = 'saved';
        const bd = action.payload.biodata || action.payload;
        state.currentId = bd._id || bd.id;
        state.formData = { ...state.formData, ...bd };
        // Update list
        const idx = state.savedList.findIndex(b => (b._id || b.id) === (bd._id || bd.id));
        if (idx >= 0) state.savedList[idx] = bd;
        else state.savedList.unshift(bd);
      })
      .addCase(saveBiodata.rejected, (state, action) => { state.saveStatus = 'error'; state.error = action.payload; })
      // delete
      .addCase(deleteBiodata.fulfilled, (state, action) => {
        state.savedList = state.savedList.filter(b => (b._id || b.id) !== action.payload);
      })
      // upload photo
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        const bd = action.payload.biodata || action.payload;
        if (bd.photo) state.formData.photo = bd.photo;
      });
  },
});

export const { setField, setFormData, setTemplate, resetForm, clearSaveStatus } = biodataSlice.actions;
export default biodataSlice.reducer;
