"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useCallback, type ReactNode } from "react";

interface ConfigField {
  key: string;
  label: string;
  description?: string;
  type: "switch" | "number" | "text" | "textarea" | "select" | "color";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface ConfigSectionProps {
  title: string;
  description: string;
  icon: string;
  fields: ConfigField[];
  values: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => Promise<void>;
  children?: ReactNode;
}

export function ConfigSection({ title, description, icon, fields, values, onSave, children }: ConfigSectionProps) {
  const [localValues, setLocalValues] = useState<Record<string, unknown>>(values);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = useCallback((key: string, value: unknown) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localValues);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} variant={saved ? "success" : "default"} size="sm">
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-200">{field.label}</label>
              {field.description && (
                <p className="text-xs text-gray-500">{field.description}</p>
              )}
            </div>
            <div className="sm:w-48 shrink-0">
              {field.type === "switch" && (
                <Switch
                  checked={Boolean(localValues[field.key])}
                  onCheckedChange={(checked) => handleChange(field.key, checked)}
                />
              )}
              {field.type === "number" && (
                <Input
                  type="number"
                  value={String(localValues[field.key] ?? "")}
                  onChange={(e) => handleChange(field.key, parseInt(e.target.value) || 0)}
                  min={field.min}
                  max={field.max}
                  className="w-full"
                />
              )}
              {field.type === "text" && (
                <Input
                  type="text"
                  value={String(localValues[field.key] ?? "")}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  value={String(localValues[field.key] ?? "")}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              )}
              {field.type === "select" && (
                <Select
                  value={String(localValues[field.key] ?? "")}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              )}
              {field.type === "color" && (
                <input
                  type="color"
                  value={String(localValues[field.key] ?? "#5865F2")}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-12 h-10 rounded-md border border-gray-600 bg-gray-700/50 cursor-pointer"
                />
              )}
            </div>
          </div>
        ))}
        {children}
      </CardContent>
    </Card>
  );
}
