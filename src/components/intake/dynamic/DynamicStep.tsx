"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { IntakeStep, StepField } from "@/types/intake";
import { ArrowRight, Check, Upload, ChevronRight } from "lucide-react";

interface DynamicStepProps {
    step: IntakeStep;
    data: any;
    onNext: (data: any) => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

export function DynamicStep({ step, data, onNext, onBack, isFirstStep, isLastStep }: DynamicStepProps) {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: data || {}
    });

    // Reset form when step changes to load new defaults
    useEffect(() => {
        reset(data || {});
    // Only reset when step.id changes, not when data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step.id, reset]);

    const onSubmit = (formData: any) => {
        onNext(formData);
    };

    const renderField = (field: StepField) => {
        const error = errors[field.id];

        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <div key={field.id} className="grid gap-3">
                        <Label htmlFor={field.id} className="text-[#101828] font-semibold">{field.label}</Label>
                        <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="h-14 rounded-2xl border-[#EAECF0] focus:ring-[#14b8a6] focus:border-[#14b8a6] text-lg px-6"
                            {...register(field.id, { required: field.required && "This field is required" })}
                        />
                        {error && <p className="text-sm text-destructive">{error.message as string}</p>}
                    </div>
                );

            case 'radio':
                return (
                    <div key={field.id} className="grid gap-4">
                        <Controller
                            name={field.id}
                            control={control}
                            rules={{ required: field.required && "Please select an option" }}
                            render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                    onValueChange={onChange}
                                    defaultValue={value}
                                    className="grid gap-3"
                                >
                                    {field.options?.map((option) => {
                                        const isSelected = value === option.value;
                                        return (
                                            <div key={option.id}>
                                                <RadioGroupItem
                                                    value={option.value}
                                                    id={`${field.id}-${option.id}`}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={`${field.id}-${option.id}`}
                                                    className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 hover:cursor-pointer min-h-[72px] ${isSelected
                                                            ? 'bg-[#08514e] border-[#08514e] text-white shadow-lg'
                                                            : 'bg-white border-[#EAECF0] text-[#101828] hover:border-[#14b8a6]/40 hover:bg-[#F9FAFB]'
                                                        }`}
                                                >
                                                    <div className="flex flex-col text-left space-y-0.5">
                                                        <span className="font-extrabold text-lg leading-tight">{option.label}</span>
                                                        {option.description && (
                                                            <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#667085]'}`}>
                                                                {option.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${isSelected ? 'bg-white border-white' : 'border-[#EAECF0]'
                                                        }`}>
                                                        {isSelected && <Check className="h-3.5 w-3.5 text-[#08514e]" strokeWidth={4} />}
                                                    </div>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            )}
                        />
                        {error && <p className="text-sm text-destructive font-medium">{error.message as string}</p>}
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.id} className="grid gap-4">
                        <Controller
                            name={field.id}
                            control={control}
                            defaultValue={[]}
                            render={({ field: { onChange, value } }) => {
                                const currentValues = Array.isArray(value) ? value : [];
                                const handleCheck = (checked: boolean, optionValue: string) => {
                                    if (checked) {
                                        onChange([...currentValues, optionValue]);
                                    } else {
                                        onChange(currentValues.filter((v: string) => v !== optionValue));
                                    }
                                };

                                return (
                                    <div className="grid gap-2">
                                        {field.options?.map((option) => {
                                            const isSelected = currentValues.includes(option.value);
                                            return (
                                                <div key={option.id} className={`flex items-center space-x-3 rounded-2xl border p-4 transition-all duration-300 hover:cursor-pointer min-h-[72px] ${isSelected
                                                        ? 'bg-[#08514e] border-[#08514e] text-white shadow-lg'
                                                        : 'bg-white border-[#EAECF0] text-[#101828] hover:border-[#14b8a6]/40 hover:bg-[#F9FAFB]'
                                                    }`}>
                                                    <Checkbox
                                                        id={`${field.id}-${option.id}`}
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) => handleCheck(checked as boolean, option.value)}
                                                        className="h-6 w-6 rounded-md border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-[#08514e] sr-only"
                                                    />
                                                    <div className="flex-1 flex flex-col text-left space-y-0.5">
                                                        <Label htmlFor={`${field.id}-${option.id}`} className="cursor-pointer font-extrabold text-lg">
                                                            {option.label}
                                                        </Label>
                                                        {option.description && (
                                                            <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#667085]'}`}>
                                                                {option.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`h-6 w-6 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ml-4 ${isSelected ? 'bg-white border-white' : 'border-[#EAECF0] rounded-full'
                                                        }`}>
                                                        {isSelected && <Check className="h-3.5 w-3.5 text-[#08514e]" strokeWidth={4} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Info Banner - More Compact */}
            <div className="bg-[#effefb] rounded-xl p-3 flex items-center justify-center space-x-3 border border-[#d2f6ef] relative">
                <div className="h-6 w-6 rounded-full bg-[#1dd3b0]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#14b8a6] font-serif italic font-bold text-xs">i</span>
                </div>
                <p className="text-[#0c5446] font-bold text-sm">
                    This is not a medical diagnosis. <span className="font-normal opacity-70">Answer as best as you can.</span>
                </p>
            </div>

            <div className="space-y-2 text-center">
                <h2 className="text-[28px] font-black tracking-tight text-[#101828] leading-tight">
                    {step.title}
                </h2>
                {step.description && <p className="text-[#667085] text-base leading-snug">{step.description}</p>}
            </div>

            <div className="grid gap-4">
                {step.fields?.map(field => renderField(field))}
            </div>

            {/* Blood Results Section - Significantly More Compact */}
            <div className="bg-white rounded-2xl border border-[#EAECF0] p-5 space-y-4 mt-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                        <h3 className="text-base font-black text-[#101828]">Recent blood test results?</h3>
                        <p className="text-xs text-[#667085]">Optional, improves recommendation relevance.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="default" className="bg-[#14b8a6] hover:bg-[#0d9488] h-10 rounded-xl font-bold px-4 text-xs shadow-sm">
                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                            Upload Now
                        </Button>
                        <Button variant="outline" className="border-[#14b8a6]/30 text-[#14b8a6] hover:bg-[#effefb] h-10 rounded-xl font-bold px-4 text-xs">
                            Add Later
                        </Button>
                        <Button variant="outline" className="border-[#14b8a6]/30 text-[#14b8a6] hover:bg-[#effefb] h-10 rounded-xl font-bold px-4 text-xs">
                            Order Test
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#F2F4F7]">
                <div className="flex items-center space-x-6">
                    {!isFirstStep ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-[#667085] font-bold text-base hover:text-[#101828]"
                        >
                            Back
                        </button>
                    ) : (
                        <div className="w-8" />
                    )}

                    <button
                        type="button"
                        className="flex items-center space-x-2 text-[#14b8a6] font-bold px-4 py-1.5 rounded-lg hover:bg-[#effefb] transition-all text-sm"
                    >
                        <span>Skip question</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                <Button
                    type="submit"
                    size="lg"
                    className="bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-xl h-12 px-8 text-lg font-black flex items-center space-x-2 shadow-md"
                >
                    <span>Continue</span>
                    <ChevronRight className="h-5 w-5 stroke-[3]" />
                </Button>
            </div>
        </form>
    );
}
