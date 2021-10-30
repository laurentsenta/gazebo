import { MainPage } from "@c/MainPage";
import { slugify } from "@gazebo/utils/text";
import Link from "next/link";
import React, { useState } from "react";

const BASE_CODE_URL = "https://github.com/laurentsenta/gazebo/tree/main/src/"

export const ContentDemoPage: React.FC<{ title: string }> = ({ title, children }) => {
    return <MainPage>
        <main className="container fullscreen fullheight">
            <h1 className="title">{title}</h1>
            {children}
        </main>
    </MainPage>
}

export const ExternalLink: React.FC<{ href: string, className?: string }> = ({ href, children, className }) => {
    return <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
    </a>
}

export const CardDemo: React.FC<{ title: string, demo?: string, code?: string }> = ({ children, title, demo, code }) => {
    return <div className="column is-6">
        <div className="card">
            <div className="card-content">
                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <h2 className="title is-size-4" id={slugify(title)}>
                                <Link href={`#${slugify(title)}`}>
                                    <a>
                                        {title}
                                    </a>
                                </Link>
                            </h2>
                        </div>
                    </div>
                    <div className="level-right">
                        {(demo || code) &&
                            <div className="level-item">
                                <div className="tags has-addons">
                                    <span className="tag is-primary is-light"><i className="fab fa-github-alt"></i></span>
                                    {demo &&
                                        <ExternalLink href={`${BASE_CODE_URL}${demo}`} className="tag is-primary is-light">
                                            Demo
                                        </ExternalLink>
                                    }
                                    {code &&
                                        <ExternalLink href={`${BASE_CODE_URL}${code}`} className="tag is-primary is-light">
                                            Code
                                        </ExternalLink>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </nav>
                <hr className="mb-3 mt-0" />
                {children}
            </div>
        </div>
    </div>
}

export const CardDescription: React.FC<{}> = ({ children }) => {
    return <>
        <div className="message">
            <div className="message-body">
                {children}
            </div>
        </div>
    </>
}

export const useJSONState = <T,>(defaultValue: T): [string, React.Dispatch<React.SetStateAction<string>>, T] => {
    const [value, setValue] = useState(JSON.stringify(defaultValue, undefined, 2))

    let jsonValue = defaultValue

    try {
        jsonValue = JSON.parse(value)
    } catch {
    }

    return [value, setValue, jsonValue]
}
