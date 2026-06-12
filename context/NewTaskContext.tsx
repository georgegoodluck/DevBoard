"use client";

import { createContext, useContext, useState } from "react";

type contextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}
