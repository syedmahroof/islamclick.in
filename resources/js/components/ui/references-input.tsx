import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Link as LinkIcon } from 'lucide-react';

interface Reference {
    id?: number;
    title: string;
    link: string;
    description?: string;
}

interface ReferencesInputProps {
    references: Reference[];
    onChange: (references: Reference[]) => void;
    errors?: any;
}

export default function ReferencesInput({ references, onChange, errors }: ReferencesInputProps) {
    const addReference = () => {
        const newReferences = [...references, { title: '', link: '', description: '' }];
        onChange(newReferences);
    };

    const removeReference = (index: number) => {
        const newReferences = references.filter((_, i) => i !== index);
        onChange(newReferences);
    };

    const updateReference = (index: number, field: keyof Reference, value: string) => {
        const newReferences = [...references];
        newReferences[index] = { ...newReferences[index], [field]: value };
        onChange(newReferences);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium">References</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReference}
                    className="flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Reference</span>
                </Button>
            </div>

            {references.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <LinkIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No references added yet</p>
                    <p className="text-sm">Click "Add Reference" to add your first reference</p>
                </div>
            )}

            {references.map((reference, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeReference(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor={`reference-title-${index}`}>Title *</Label>
                            <Input
                                id={`reference-title-${index}`}
                                value={reference.title}
                                onChange={(e) => updateReference(index, 'title', e.target.value)}
                                placeholder="Enter reference title"
                            />
                            {errors?.[`references.${index}.title`] && (
                                <p className="text-sm text-red-500">{errors[`references.${index}.title`]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`reference-link-${index}`}>Link *</Label>
                            <Input
                                id={`reference-link-${index}`}
                                type="url"
                                value={reference.link}
                                onChange={(e) => updateReference(index, 'link', e.target.value)}
                                placeholder="https://example.com"
                            />
                            {errors?.[`references.${index}.link`] && (
                                <p className="text-sm text-red-500">{errors[`references.${index}.link`]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`reference-description-${index}`}>Description</Label>
                            <Textarea
                                id={`reference-description-${index}`}
                                value={reference.description || ''}
                                onChange={(e) => updateReference(index, 'description', e.target.value)}
                                placeholder="Optional description of the reference"
                                rows={3}
                            />
                            {errors?.[`references.${index}.description`] && (
                                <p className="text-sm text-red-500">{errors[`references.${index}.description`]}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {errors?.references && (
                <p className="text-sm text-red-500">{errors.references}</p>
            )}
        </div>
    );
}



