import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Modal, Fade } from "@mui/material";
import UserService from '../../services/UserService.js';

export default function EditProfileModal({ open, onClose, profile, onSave }) {
  const [form, setForm] = useState(profile);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = async () => {
    try {
      await UserService.updateProfile(form);
      onSave(form);
    } catch (error) {
      // Optionally handle error (show message)
    }
  };

  // Accessibility fix: set inert on #root when modal is open
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      if (open) {
        root.setAttribute("inert", "");
      } else {
        root.removeAttribute("inert");
      }
    }
    return () => {
      if (root) root.removeAttribute("inert");
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition hideBackdrop>
      <Fade in={open}>
        <Box
          className="max-w-md w-full mx-auto mt-32 bg-white rounded-2xl shadow-2xl p-10 outline-none border-4 border-yellow-400 animate-pulse-fast"
          style={{ boxShadow: '0 8px 32px 0 rgba(255,193,7,0.15)' }}
        >
          <Typography variant="h5" className="mb-6 font-bold text-gray-800 text-center">
            Edit Profile
          </Typography>

          {/* Wrap all fields in a Box and apply 1px spacing */}
          <Box sx={{ '& .MuiTextField-root': { mb: '8px' } }}>
            <TextField
              label="Full Name"
              name="full_name"
              value={form.full_name ?? ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email ?? ""}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone ?? ""}
              onChange={handleChange}
              fullWidth
            />

          </Box>

          <Box className="flex justify-end space-x-2 mt-8">
            <Button onClick={onClose} variant="outlined" className="border-gray-400">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
