import { Download, Share, MoreVertical, Plus, Check, Smartphone, Monitor, Apple, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { Link } from "react-router-dom";

export default function Install() {
  const { isInstallable, isInstalled, isIOS, isSafari, isChrome, isFirefox, isSamsung, isAndroid, promptInstall, browserName } = usePwaInstall();

  const handleInstall = async () => {
    await promptInstall();
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Already Installed!</CardTitle>
            <CardDescription>
              NaijaTaxAI is already installed on your device. You can find it on your home screen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Go to App</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Install <span className="text-primary">Naija</span>TaxAI
          </h1>
          <p className="text-muted-foreground text-lg">
            Get quick access to Nigeria's AI-powered tax assistant right from your home screen.
          </p>
        </div>

        {/* Native Install Button (when available) */}
        {isInstallable && (
          <Card className="mb-8 border-primary">
            <CardContent className="pt-6">
              <Button onClick={handleInstall} size="lg" className="w-full accent-gradient text-primary-foreground">
                <Download className="w-5 h-5 mr-2" />
                Install App Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* iOS Safari Instructions */}
        {isIOS && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5" />
                Install on iPhone/iPad
              </CardTitle>
              <CardDescription>Safari browser required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap the Share button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for the <Share className="w-4 h-4" /> icon at the bottom of Safari
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Scroll down and tap "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for the <Plus className="w-4 h-4" /> Add to Home Screen option
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Tap "Add" to confirm</p>
                  <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Android Chrome/Edge Instructions */}
        {isAndroid && (isChrome || !isFirefox && !isSamsung) && !isInstallable && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Chrome className="w-5 h-5" />
                Install on Android (Chrome)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap the menu button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for the <MoreVertical className="w-4 h-4" /> icon in the top right
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Tap "Install app" or "Add to Home screen"</p>
                  <p className="text-sm text-muted-foreground">The option may vary by browser version</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm the installation</p>
                  <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Firefox/Samsung Instructions */}
        {isAndroid && (isFirefox || isSamsung) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Install on {isFirefox ? "Firefox" : "Samsung Browser"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Tap the menu button</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Look for the <MoreVertical className="w-4 h-4" /> icon
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">
                    {isFirefox ? 'Tap "Install"' : 'Tap "Add page to" → "Home screen"'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm to add</p>
                  <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desktop Instructions */}
        {!isIOS && !isAndroid && !isInstallable && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Install on Desktop ({browserName})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(isChrome || isSafari === false) ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Look for the install icon in the address bar</p>
                      <p className="text-sm text-muted-foreground">
                        It appears as a <Download className="w-4 h-4 inline" /> or computer icon on the right side
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Click "Install" to confirm</p>
                      <p className="text-sm text-muted-foreground">The app will open in its own window</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Desktop Safari doesn't support app installation. For the best experience, use Chrome, Edge, or access on mobile.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Why Install?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Quick access from your home screen</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Works offline for faster loading</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Full-screen experience without browser UI</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>No app store download required</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to NaijaTaxAI
          </Link>
        </div>
      </div>
    </div>
  );
}
