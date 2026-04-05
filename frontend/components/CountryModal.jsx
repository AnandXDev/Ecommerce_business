import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function CountryModal({ isOpen, onClose, onSelectLocation }) {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch countries once when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2")
        .then((res) => res.json())
        .then((data) => {
          // Map relevant info: name.common, cca2 (code), flags.png
          const mapped = data.map((c) => ({
            name: c.name.common,
            code: c.cca2,
            flag: c.flags?.png || c.flags?.svg || "",
          }));

          // Sort alphabetically
          mapped.sort((a, b) => a.name.localeCompare(b.name));

          setCountries(mapped);
          setFilteredCountries(mapped);
          setLoading(false);
        })
        .catch(() => {
          setCountries([]);
          setFilteredCountries([]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Filter countries on search change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  const handleSelect = (country) => {
    onSelectLocation(country);
    // Close the modal after selection
    setTimeout(() => {
      onClose();
    }, 0);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select Your Location</DialogTitle>
      <DialogContent>
        <TextField
          label="Search country"
          variant="outlined"
          fullWidth
          margin="dense"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              mt: 1,
            }}
          >
            {filteredCountries.length === 0 && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                No countries found.
              </Typography>
            )}
            {filteredCountries.map(({ name, code, flag }) => (
              <ListItem key={code} disablePadding>
                <ListItemButton onClick={() => handleSelect({ name, code, flag })}>
                  <Box
                    component="img"
                    src={flag}
                    alt={`${name} flag`}
                    sx={{ width: 30, height: 20, mr: 2, objectFit: "cover", borderRadius: "2px" }}
                  />
                  <ListItemText primary={`${name} (${code})`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}