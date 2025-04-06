import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is AB 2511?",
    answer: "AB 2511 is a California state law that requires Skilled Nursing Facilities to have backup power systems capable of maintaining critical operations during power outages. Facilities must comply by January 1, 2026."
  },
  {
    question: "How many hours of backup power are required?",
    answer: "The law requires a minimum of 10 hours of backup power for critical systems. However, we recommend 12+ hours to ensure adequate coverage during extended outages."
  },
  {
    question: "What systems need to be backed up?",
    answer: "Critical systems that must remain operational include: medical equipment, refrigeration for medications, HVAC for temperature-sensitive areas, emergency lighting, communication systems, and essential monitoring equipment."
  },
  {
    question: "What are the advantages of battery backup vs. diesel generators?",
    answer: "Battery systems offer several advantages: no emissions during operation, quieter operation, no fuel storage requirements, lower maintenance costs, and potential incentives/rebates. They're also exempt from air quality permitting requirements."
  },
  {
    question: "Are there incentives available for battery systems?",
    answer: "Yes, multiple incentives exist including the Self-Generation Incentive Program (SGIP), federal Investment Tax Credits (ITC), and various utility-specific rebate programs, especially for facilities in high-risk fire zones."
  },
  {
    question: "How long does the installation process take?",
    answer: "The complete process typically takes 3-6 months including assessment, design, permitting, and installation. We recommend starting at least 12 months before the compliance deadline to ensure timely completion."
  },
  {
    question: "Do I need to replace my existing generator?",
    answer: "Not necessarily. Many facilities choose to implement a hybrid solution with both battery storage and existing backup generators for redundancy and extended outage protection."
  },
  {
    question: "What maintenance is required for battery systems?",
    answer: "Battery systems require minimal maintenance compared to generators. Typical maintenance includes quarterly remote diagnostics, annual on-site inspection, and periodic firmware updates."
  },
  {
    question: "Can I use the battery system for other purposes?",
    answer: "Yes, when not being used for backup power, the system can provide other benefits such as peak demand shaving, time-of-use optimization, and participation in utility demand response programs, creating additional value."
  },
  {
    question: "How do I get started with compliance?",
    answer: "The first step is completing your facility assessment through the EverGrid platform. Upload your facility data, complete the load analysis, and our team will help guide you through the remaining steps to compliance."
  }
];

export function FAQ() {
  return (
    <Card className="bg-white rounded-lg shadow overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h2>
        <p className="text-gray-500">
          Common questions about AB 2511 compliance and microgrid implementation
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Need more information?</h3>
          <p className="mt-2 text-sm text-blue-600">
            Contact our support team at <a href="mailto:support@evergrid.com" className="underline">support@evergrid.com</a> or call us at (800) 555-1234 for assistance with your specific questions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
