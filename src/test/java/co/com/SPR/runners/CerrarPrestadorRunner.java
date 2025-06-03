package co.com.SPR.runners;

import cucumber.api.CucumberOptions;
import cucumber.api.SnippetType;
import net.serenitybdd.cucumber.CucumberWithSerenity;
import org.junit.runner.RunWith;

@RunWith(CucumberWithSerenity.class)
@CucumberOptions(
        features = "src/test/resources/features/CerrarPrestador.feature",
        glue = {"co.com.SPR.stepsdefinitions", "co.com.SPR.utils.hooks"},
        snippets = SnippetType.CAMELCASE)
public class CerrarPrestadorRunner {
}
