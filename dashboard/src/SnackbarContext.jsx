import React, { useState, useCallback, createContext, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = useCallback((message, severity = "success", duration = 3000) => {
    const id = Date.now();
    setSnackbars((prev) => [...prev, { id, message, severity, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setSnackbars((prev) => prev.filter((snack) => snack.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const closeSnackbar = useCallback((id) => {
    setSnackbars((prev) => prev.filter((snack) => snack.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      {snackbars.map((snack) => (
        <Snackbar
          key={snack.id}
          open={true}
          autoHideDuration={snack.duration}
          onClose={() => closeSnackbar(snack.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => closeSnackbar(snack.id)}
            severity={snack.severity}
            sx={{ width: "100%", fontWeight: "500" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return context;
};
