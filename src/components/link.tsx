import Link from "next/link";
import { useRouter } from "next/router";
import React, { Children } from "react";

interface LinkProps {
    href: string;
    children: any;
    activeClassName?: string;
}

const ActiveLink: React.FC<LinkProps> = ({ href, activeClassName, children, ...props }) => {
    const child = Children.only(children);

    const router = useRouter()
    const isActive = (router.pathname === href && activeClassName)
    let className = isActive ? activeClassName : ''

    if (child.props.className) {
        className = `${child.props.className} ${className}`
    }

    return <Link href={href} {...props}>
        {React.cloneElement(child, { className })}
    </Link>
}

export const BulmaLink: React.FC<LinkProps> = ({ children, ...props }) => (
    <ActiveLink href={props.href} activeClassName={props.activeClassName || "is-active"}>
        {children}
    </ActiveLink>
)

export const BulmaTab: React.FC<LinkProps & { isActive: boolean }> = ({ href, activeClassName, isActive, children, ...props }) => {
    const child = Children.only(children);

    const router = useRouter()
    const isREALLYActive = ((isActive || router.pathname === href))
    let className = isREALLYActive ? activeClassName || 'is-active' : ''

    if (child.props.className) {
        className = `${child.props.className} ${className}`
    }

    return <li className={className}>
        <Link href={href} {...props}>
            {React.cloneElement(child, { className })}
        </Link>
    </li>
}