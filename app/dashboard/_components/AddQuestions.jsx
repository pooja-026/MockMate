"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

const TECHNICAL_QUESTIONS = {
  "Full stack Developer": [
    { q: "Explain the difference between SQL and NoSQL databases.", a: "SQL databases are structured, NoSQL databases are more flexible and scalable." },
    { q: "How does React handle state management?", a: "React uses useState, useReducer, and context API for managing state." },
    { q: "What is the event loop in Node.js?", a: "The event loop allows Node.js to perform non-blocking I/O operations." },
    { q: "What is Redux?", a: "Redux is a state management library for JavaScript apps." },
    { q: "How do you optimize React performance?", a: "Use memoization, lazy loading, and shouldComponentUpdate." },
    { q: "Explain the box model in CSS.", a: "It consists of content, padding, border, and margin." },
    { q: "What are WebSockets?", a: "WebSockets provide full-duplex communication between the client and server." },
    { q: "What is GraphQL?", a: "GraphQL is a query language for APIs that provides flexibility in data fetching." },
    { q: "Explain Microservices architecture.", a: "Microservices split applications into small, independent services." },
    { q: "What is server-side rendering (SSR)?", a: "SSR renders pages on the server and sends HTML to the client." },
    { q: "What is Docker?", a: "Docker is a containerization platform that packages applications with dependencies." },
    { q: "What is TypeScript?", a: "TypeScript is a strongly typed programming language that builds on JavaScript." },
    { q: "What are RESTful APIs?", a: "RESTful APIs follow REST principles and use HTTP methods for communication." },
    { q: "How does authentication work in web applications?", a: "Authentication methods include JWT, OAuth, and session-based authentication." },
    { q: "What is Next.js?", a: "Next.js is a React framework for building server-rendered applications." },
    { q: "What is a Progressive Web App (PWA)?", a: "A PWA is a web application with native app-like capabilities." },
    { q: "Explain the concept of Component Lifecycle in React.", a: "It includes mounting, updating, and unmounting phases." },
    { q: "What is Webpack?", a: "Webpack is a module bundler for JavaScript applications." },
    { q: "How does caching improve web performance?", a: "Caching reduces load times by storing frequently accessed data." },
    { q: "What is the purpose of a reverse proxy?", a: "A reverse proxy routes client requests to backend servers." }
  ],
  "Frontend Developer": [
    { q: "What is the virtual DOM in React?", a: "Virtual DOM is a lightweight representation of the actual DOM." },
    { q: "What are React Hooks?", a: "Hooks allow functional components to use state and lifecycle features." },
    { q: "What is JSX?", a: "JSX is a syntax extension for JavaScript that allows writing HTML in React." },
    { q: "Explain CSS Flexbox.", a: "Flexbox is a layout model for distributing space in a container." },
    { q: "Explain the difference between relative and absolute positioning in CSS.", a: "Relative positioning moves an element relative to itself, absolute is positioned relative to the nearest ancestor." },
    { q: "What are pseudo-classes in CSS?", a: "Pseudo-classes define a special state of an element (e.g., :hover, :focus)." },
    { q: "What is lazy loading in React?", a: "Lazy loading delays the loading of non-critical resources to improve performance." },
    { q: "How does React handle forms?", a: "React handles forms using controlled and uncontrolled components." },
    { q: "What is the difference between class and functional components in React?", a: "Class components have state and lifecycle methods, functional components use hooks." },
    { q: "What is Tailwind CSS?", a: "Tailwind CSS is a utility-first CSS framework for rapid UI development." },
    { q: "What is Web Accessibility (a11y)?", a: "Web accessibility ensures web content is usable by people with disabilities." },
    { q: "What is a service worker?", a: "A service worker enables offline functionality in web applications." },
    { q: "How does React Router work?", a: "React Router enables navigation between components without reloading the page." },
    { q: "What are media queries in CSS?", a: "Media queries enable responsive designs by applying styles based on device size." },
    { q: "What is a content delivery network (CDN)?", a: "A CDN distributes content across multiple locations to improve load times." },
    { q: "What are keyframes in CSS?", a: "Keyframes define animations in CSS." },
    { q: "What is the difference between em and rem in CSS?", a: "em is relative to the parent element, rem is relative to the root element." },
    { q: "What are Web Components?", a: "Web Components are reusable, encapsulated UI components using standard APIs." },
    { q: "What is Code Splitting?", a: "Code splitting reduces bundle size by loading code only when needed." },
    { q: "What is the Shadow DOM?", a: "Shadow DOM encapsulates styles and markup to avoid conflicts." }
  ]
};

const AddQuestions = () => {
  const [jobPosition, setJobPosition] = useState("Full stack Developer");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { user } = useUser();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Select Job Role to View Technical Questions</h2>
      <select
        className="border p-2 rounded"
        value={jobPosition}
        onChange={(e) => setJobPosition(e.target.value)}
      >
        {Object.keys(TECHNICAL_QUESTIONS).map((role) => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Technical Questions</h3>
        <ul className="mt-4 space-y-3">
          {TECHNICAL_QUESTIONS[jobPosition].map((item, index) => (
            <li key={index} className="p-3 border rounded bg-gray-100">
              <div className="flex justify-between items-center">
                <span>{item.q}</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedQuestion(item)}>
                  View Answer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedQuestion && (
        <Dialog open={Boolean(selectedQuestion)} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedQuestion.q}</DialogTitle>
            </DialogHeader>
            <p className="mt-4">{selectedQuestion.a}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AddQuestions;
