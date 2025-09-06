import React, { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "connected" | "error"
  >("testing");
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    client: boolean;
    auth: boolean;
    database: boolean;
  }>({ client: false, auth: false, database: false });

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      console.log("[SupabaseTest] 🧪 Testing Supabase connection...");

      // Test 1: Client initialization
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Failed to initialize Supabase client");
      }
      setTestResults((prev) => ({ ...prev, client: true }));
      console.log("[SupabaseTest] ✅ Client initialized");

      // Test 2: Auth service
      const { data: authData, error: authError } =
        await client.auth.getSession();
      if (authError) {
        console.warn(
          "[SupabaseTest] ⚠️ Auth error (expected if not logged in):",
          authError,
        );
      } else {
        console.log("[SupabaseTest] ✅ Auth service working");
      }
      setTestResults((prev) => ({ ...prev, auth: true }));

      // Test 3: Database connection
      const { data: dbData, error: dbError } = await client
        .from("profiles")
        .select("count")
        .limit(1);
      if (dbError) {
        console.warn("[SupabaseTest] ⚠️ Database error:", dbError);
        if (dbError.message.includes('relation "profiles" does not exist')) {
          setError(
            "Profiles table does not exist. Please run the SQL script in Supabase dashboard.",
          );
        } else {
          setError(`Database error: ${dbError.message}`);
        }
      } else {
        console.log("[SupabaseTest] ✅ Database connection working");
        setTestResults((prev) => ({ ...prev, database: true }));
      }

      setConnectionStatus("connected");
    } catch (err: any) {
      console.error("[SupabaseTest] ❌ Connection test failed:", err);
      setError(err.message);
      setConnectionStatus("error");
    }
  };

  const getStatusIcon = (status: "testing" | "connected" | "error") => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: "testing" | "connected" | "error") => {
    switch (status) {
      case "testing":
        return "Testing connection...";
      case "connected":
        return "Connected successfully!";
      case "error":
        return "Connection failed";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(connectionStatus)}
          Supabase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {getStatusText(connectionStatus)}
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {testResults.client ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Client Initialization</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {testResults.auth ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Auth Service</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {testResults.database ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span>Database Connection</span>
          </div>
        </div>

        <Button
          onClick={testSupabaseConnection}
          variant="outline"
          className="w-full"
          disabled={connectionStatus === "testing"}
        >
          {connectionStatus === "testing" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Again"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
