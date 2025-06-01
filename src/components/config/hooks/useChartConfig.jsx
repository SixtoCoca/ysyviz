import { useState } from "react";

export const useChartConfig = () => {
    const [cfg, setCfg] = useState({ title: "" });
    return [cfg, setCfg];
};
