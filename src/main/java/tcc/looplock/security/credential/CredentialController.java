package tcc.looplock.security.credential;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/credential")
@RequiredArgsConstructor
public class CredentialController {

    private final CredentialService CredentialService;

    @PreAuthorize("hasRole('CREDENTIAL_SELECT')")
    @GetMapping
    public List<Credential> listAll(){
        return CredentialService.listAll();
    }

    @PreAuthorize("hasRole('CREDENTIAL_INSERT')")
    @PostMapping
    public Credential create(@RequestBody Credential credential){
        return CredentialService.create(credential);
    }

    @PreAuthorize("hasRole('CREDENTIAL_UPDATE')")
    @PutMapping
    public Credential update(@RequestBody Credential Credential){
        return CredentialService.update(Credential);
    }

    @PreAuthorize("hasRole('CREDENTIAL_DELETE')")
    @DeleteMapping
    public void delete(@RequestParam("id") Long id){
        CredentialService.delete(id);
    }
}
