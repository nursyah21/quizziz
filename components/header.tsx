import { ReactNode } from "react";

export const Header = ({ children }: { children?: ReactNode }) => (
    <div className="mb-6 flex justify-between items-center gap-4 sticky top-0 bg-white p-4">
        {children}
    </div>
)