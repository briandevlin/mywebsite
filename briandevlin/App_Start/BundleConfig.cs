using System.Threading;
using System.IO;
using System.Web.Optimization;
using System.Web;


namespace briandevlin.App_Start
{
    public class BundleConfig
    {

        public static string AdminAppDir = "app";
        public static string BundleOutputFile = "scripts\\briandevlin.bundled.js";
        public static string ScriptsBundleVirtualPath = "~/bundles/appScripts";

        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery-2.1.4.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                      "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                   "~/Scripts/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularJS").Include(
           "~/Scripts/angular.min.js",            
           "~/Scripts/angular-ui-router.min.js",
           "~/Scripts/angular-ui/ui-bootstrap-tpls.min.js",
            "~/Scripts/angular-ui/ui-bootstrap.min.js",
           "~/Scripts/ui-grid.min.js",                     
           "~/Scripts/angular-animate.min.js"           
           ));

            bundles.Add(new ScriptBundle("~/bundles/widgits").Include(
           "~/Scripts/lodash.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                     "~/Content/bootstrap.css",
                     "~/Content/bootstrap-theme.min.css",                  
                     "~/Content/ui-grid.min.css",
                     "~/Content/animate.css",
                     "~/Content/site.css"));

            AddAppBundles(bundles);

        }

        private static void AddAppBundles(BundleCollection bundles)
        {
            var scriptBundle = new ScriptBundle(ScriptsBundleVirtualPath);
#if (DEBUG && LOCAL)
            var adminAppDirFullPath = Path.Combine(HttpRuntime.AppDomainAppPath, AdminAppDir);

            // Create the .NET bundle, then use that list to generate an actual bundle.js file
            if (Directory.Exists(adminAppDirFullPath))
            {
                scriptBundle.Include(
                    // Order matters, so get the core app setup first
                    string.Format("~/{0}/app.core.module.js", AdminAppDir),
                    string.Format("~/{0}/app.module.js", AdminAppDir))
                    // then get any other top level js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*.js", false)
                    // then get all nested module js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*-module.js", true)
                    // finally, get all the other js files
                    .IncludeDirectory(string.Format("~/{0}", AdminAppDir), "*.js", true);

                bundles.Add(scriptBundle);

                // Generate a new bundle script.  This should only be done on a local box as running from the build server causes issues.
                GenerateBundleJS(scriptBundle, bundles);
            }
#elif (DEBUG && !LOCAL)
            scriptBundle.Include(string.Format("~/{0}/briandevlin.bundled.js", "scripts"));
            bundles.Add(scriptBundle);
#elif !DEBUG
            scriptBundle.Include(string.Format("~/{0}/briandevlin.bundled.min.js", "scripts"));
            bundles.Add(scriptBundle);
#endif
        }
          private async static void GenerateBundleJS(ScriptBundle scriptBundle, BundleCollection bundles)
        {
            string bundleOutputPath = Path.Combine(HttpRuntime.AppDomainAppPath, BundleOutputFile);
            BundleContext context = new BundleContext(new HttpContextWrapper(HttpContext.Current), bundles, ScriptsBundleVirtualPath);
            System.Text.StringBuilder fileSpacer = new System.Text.StringBuilder();

            try
            {
                using (StreamWriter outputStream = new StreamWriter(bundleOutputPath))
                {
                    outputStream.BaseStream.Seek(0, SeekOrigin.End);
                    System.Collections.Generic.List<string> filePaths = PrepareFileList(scriptBundle.EnumerateFiles(context));

                    foreach (string filePath in filePaths)
                    {
                        string fileSpacerText = BuildFileSpacer(fileSpacer, filePath);

                        await outputStream.WriteAsync(fileSpacerText);

                        using (StreamReader jsFileStream = new StreamReader(filePath))
                        {
                            await outputStream.WriteAsync(await jsFileStream.ReadToEndAsync());
                        }
                    }
                }
            }
            catch (System.NullReferenceException nullEx)
            {
                string error = nullEx.Message;
            }
        }

        private static string BuildFileSpacer(System.Text.StringBuilder spacer, string filename)
        {
            spacer.Clear();

            spacer.AppendLine();
            spacer.AppendLine("//*********************************************************");
            spacer.AppendFormat("// File: {0}", filename);
            spacer.AppendLine();
            spacer.AppendFormat("// Last updated: {0}", System.DateTime.Now.ToString("G"));
            spacer.AppendLine();
            spacer.AppendLine("//");

            return spacer.ToString();
        }

        private static System.Collections.Generic.List<string> PrepareFileList(System.Collections.Generic.IEnumerable<BundleFile> bundleFiles)
        {
            // Guarantee no dupliates (the script bundle is including a few files twice
            // Convert virtual paths to file paths
            System.Collections.Generic.List<string> filePaths = new System.Collections.Generic.List<string>();

            foreach (BundleFile file in bundleFiles)
            {
                // Convert path
                string convertedPath = Path.Combine(HttpRuntime.AppDomainAppPath, file.VirtualFile.VirtualPath.Substring(1));

                // Do not include the output file
                if (!file.VirtualFile.Name.Contains(BundleOutputFile))
                {
                    // Only include if not already in the list
                    if (!filePaths.Contains(convertedPath))
                    {
                        filePaths.Add(convertedPath);
                    }
                }
            }

            return filePaths;
        }
    }
    
    
}