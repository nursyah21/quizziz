import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";

export function SearchAction() {
    const formStatus = useFormStatus()
    return <>
        <Input disabled={formStatus.pending} name="search" placeholder="Search" className="" />
        <Button disabled={formStatus.pending} type="submit" className="p-2" onClick={() => { }}>
            <SearchIcon className="h-5 w-5" />
        </Button>
    </>
}