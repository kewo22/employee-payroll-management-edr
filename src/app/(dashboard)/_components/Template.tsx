'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardProps } from "@/types/dashboard-template-props";


export default function Template(props: DashboardProps) {
    const { children, title, actionBtnText, onActionClick } = props;

    const wrapperClasses = cn("p-10")
    const titleClasses = cn("text-2xl font-bold")

    if (actionBtnText && onActionClick) {
        return (
            <div className={wrapperClasses}>
                <div className="mb-5 flex flex-row items-center justify-between">
                    <h1 className={titleClasses}>{title}</h1>
                    {actionBtnText && onActionClick && <Button size="sm" onClick={onActionClick}> {actionBtnText} </Button>}
                </div>
                {children}
            </div>
        )
    }

    return (
        <div className={wrapperClasses}>
            <h1 className={cn('mb-5', titleClasses)}>{title}</h1>
            {children}
        </div>
    )

}
